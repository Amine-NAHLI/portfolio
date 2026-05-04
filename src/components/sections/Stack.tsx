"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { stackFilter } from "@/lib/stackFilter";
import type { Skill } from "@/lib/github";
import { Terminal, Cpu, Database, Shield } from "lucide-react";

const StackVisual = dynamic(() => import("@/components/three/StackVisual"), { ssr: false });

const CAT_ICONS = {
  Security: Shield,
  "Full-Stack": Cpu,
  AI: Database,
  Experiments: Terminal,
};

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
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">Inventory.load()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Technical <span className="text-text-4">Arsenal.</span>
            </h2>
          </div>
          <p className="max-w-xs text-text-3 text-sm font-mono uppercase tracking-widest leading-loose">
            Interactive constellation of core technologies and frameworks used in production.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* 3D Interaction Zone */}
          <div className="relative h-[600px] rounded-[3rem] bg-bg-1 border border-white/5 overflow-hidden group">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-1 via-transparent to-transparent pointer-events-none" />
            
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <Suspense fallback={null}>
                <StackVisual skills={skills} onSelect={handleSelect} />
              </Suspense>
            </Canvas>

            {/* Instruction Overlay */}
            <div className="absolute top-10 left-10 flex items-center gap-4">
               <div className="px-4 py-2 rounded-full glass border border-white/10 font-mono text-[9px] uppercase tracking-widest text-text-4 group-hover:text-cyan transition-colors">
                 Interact to explore
               </div>
            </div>
          </div>

          {/* List/Legend Zone */}
          <div className="space-y-12">
            {skills.map((skill, i) => {
              const Icon = CAT_ICONS[skill.category as keyof typeof CAT_ICONS] || Terminal;
              return (
                <motion.div
                  key={skill.category}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="text-cyan" size={18} />
                    <h4 className="font-mono text-xs uppercase tracking-[0.4em] text-text-1">
                      {skill.category}
                    </h4>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {skill.techs.map(tech => (
                      <button
                        key={tech}
                        onClick={() => handleSelect(tech)}
                        className={`px-6 py-3 rounded-full border font-mono text-[10px] uppercase tracking-widest transition-all ${activeTech === tech ? "bg-cyan border-cyan text-bg-0 shadow-xl shadow-cyan/20" : "bg-bg-1 border-white/5 text-text-4 hover:border-white/20 hover:text-text-2"}`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
