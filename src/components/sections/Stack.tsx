"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Skill } from "@/lib/github";
import { cn } from "@/lib/utils";

const ACCENTS: Record<string, { text: string; bg: string; bar: string; stripe: string }> = {
  Security:     { text: "text-accent-cyan",   bg: "bg-accent-cyan/10",   bar: "bg-accent-cyan",   stripe: "from-accent-cyan/30"   },
  "Full-Stack": { text: "text-accent-indigo", bg: "bg-accent-indigo/10", bar: "bg-accent-indigo", stripe: "from-accent-indigo/30" },
  AI:           { text: "text-accent-purple", bg: "bg-accent-purple/10", bar: "bg-accent-purple", stripe: "from-accent-purple/30" },
  Experiments:  { text: "text-amber-400",     bg: "bg-amber-400/10",     bar: "bg-amber-400",     stripe: "from-amber-400/30"     },
};
const FALLBACK = ACCENTS.Security;

const CategoryCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const a = ACCENTS[skill.category] || FALLBACK;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-7 rounded-2xl bg-bg-secondary/50 border border-white/8 backdrop-blur-sm overflow-hidden group hover:border-white/14 transition-all duration-[400ms]"
    >
      {/* Top stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r to-transparent", a.stripe)} aria-hidden="true" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={cn("w-2 h-2 rounded-full", a.bar)} aria-hidden="true" />
        <h3 className={cn("text-sm font-semibold uppercase tracking-[0.15em] font-mono", a.text)}>
          {skill.name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-[13px] text-text-secondary leading-relaxed mb-5 italic">{skill.description}</p>

      {/* Proficiency */}
      <div className="mb-5" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} proficiency: ${skill.level}%`}>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-mono text-text-faint uppercase tracking-wider">Proficiency</span>
          <span className="text-[11px] font-mono text-text-faint">{skill.level}%</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
            className={cn("h-full rounded-full", a.bar)}
          />
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {skill.techs.map((tech) => (
          <span
            key={tech}
            className={cn("px-2.5 py-1 rounded-full text-[11px] font-mono border", a.bg, a.text, "border-transparent")}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const Stack = ({ skills }: { skills: Skill[] }) => (
  <section id="stack" className="py-24 md:py-32 bg-bg overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeader
        number="03"
        label="Stack"
        heading={<>Tools of the <span className="gradient-text">trade.</span></>}
        subheading="Parsed from my GitHub profile and updated in real-time."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {skills.map((skill, i) => (
          <CategoryCard key={skill.name} skill={skill} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Stack;
