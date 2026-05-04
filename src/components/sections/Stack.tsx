"use client";

import React, { useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Shield, Cpu, Database, Terminal, Layers } from "lucide-react";
import { stackFilter } from "@/lib/stackFilter";
import type { Skill } from "@/lib/github";

const CAT_ICONS = {
  Security: Shield,
  "Full-Stack": Cpu,
  AI: Database,
  Experiments: Terminal,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Stack({ skills }: { skills: Skill[] }) {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const handleSelect = (name: string | null) => {
    setActiveTech(name);
    stackFilter.emit(name);
    if (name) {
      const el = document.getElementById("projects");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="stack" className="relative py-40 bg-bg-0">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32"
        >
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">Inventory.load()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Technical <span className="text-text-4">Arsenal.</span>
            </h2>
          </div>
          <p className="max-w-xs text-text-3 text-sm font-mono uppercase tracking-[0.2em] leading-loose">
            A curated selection of core technologies and frameworks used in production environments.
          </p>
        </motion.div>

        {/* Logo Grid (Grouped by Category) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, i) => {
            const Icon = CAT_ICONS[skill.category as keyof typeof CAT_ICONS] || Terminal;
            return (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan border border-white/5">
                    <Icon size={18} />
                  </div>
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.4em] text-text-1">
                    {skill.category}
                  </h4>
                </div>
                
                <div className="flex flex-col gap-3">
                  {skill.techs.map((tech, j) => (
                    <motion.button
                      key={tech}
                      onClick={() => handleSelect(tech)}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                        activeTech === tech 
                          ? "bg-cyan/10 border-cyan/30 text-cyan" 
                          : "bg-bg-1 border-white/5 text-text-3 hover:border-white/20 hover:text-text-1"
                      }`}
                    >
                      <span className="font-mono text-xs uppercase tracking-widest">{tech}</span>
                      <div className={`w-1 h-1 rounded-full transition-all ${activeTech === tech ? "bg-cyan scale-150" : "bg-white/10 group-hover:bg-cyan/40"}`} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700"
        >
          <div className="flex items-center gap-4">
            <Layers size={16} className="text-text-4" />
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-text-4">Cross-Platform Proficiency</span>
          </div>
          <div className="flex gap-12">
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Current Focus</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-2">Zero Trust Architecture</span>
             </div>
             <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-4">Preferred Env</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-2">Linux / Docker</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
