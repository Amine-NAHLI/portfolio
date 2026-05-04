"use client";

import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Globe, Shield, Cpu, Database, Command, ExternalLink } from "lucide-react";
import { stackFilter } from "@/lib/stackFilter";
import type { PortfolioData } from "@/lib/github";

const EASE = [0.16, 1, 0.3, 1] as const;

interface OrbitItemProps {
  text: string;
  radius: number;
  speed: number;
  index: number;
  total: number;
  onSelect: (name: string) => void;
  active: boolean;
}

const OrbitItem = ({ text, radius, speed, index, total, onSelect, active }: OrbitItemProps) => {
  const angle = (index / total) * Math.PI * 2;
  
  return (
    <motion.div
      animate={{
        rotateZ: 360,
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <motion.button
        onClick={() => onSelect(text)}
        whileHover={{ scale: 1.2, z: 20 }}
        className={`absolute pointer-events-auto px-4 py-1.5 rounded-full border font-mono text-[9px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap shadow-xl ${
          active 
            ? "bg-accent-cyan border-accent-cyan text-bg-0 shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
            : "bg-bg-1 border-text-1/[0.05] text-text-3 hover:border-accent-cyan hover:text-text-1"
        }`}
        style={{
          left: `calc(50% + ${Math.cos(angle) * radius}px)`,
          top: `calc(50% + ${Math.sin(angle) * radius}px)`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        {text}
      </motion.button>
    </motion.div>
  );
};

export default function Stack({ orbit }: { orbit: PortfolioData["techOrbit"] }) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const handleSelect = (name: string) => {
    setActiveTech(name === activeTech ? null : name);
    stackFilter.emit(name === activeTech ? null : name);
    if (name !== activeTech) {
      const el = document.getElementById("projects");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="stack" ref={containerRef} className="relative py-48 bg-bg-0 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Content Side */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-accent-cyan" />
                <span className="font-mono text-accent-cyan text-[10px] uppercase tracking-[0.5em]">Inventory.load()</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-8">
                Technical <br /> <span className="gradient-text">Arsenal.</span>
              </h2>
              <p className="max-w-md text-text-3 text-sm md:text-base leading-relaxed">
                A dynamic extraction of my engineering landscape. This world represents every technology integrated into my production environments, categorized by their orbital role in my stack.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { label: "Core", count: orbit.core.length, icon: Cpu, color: "var(--accent-cyan)" },
                 { label: "Frameworks", count: orbit.frameworks.length, icon: Database, color: "var(--accent-indigo)" },
                 { label: "Tools", count: orbit.tools.length, icon: Shield, color: "var(--accent-purple)" }
               ].map((item, i) => (
                 <motion.div 
                   key={item.label}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 rounded-[2rem] bg-bg-1 border border-text-1/[0.05] space-y-4"
                 >
                    <item.icon size={20} style={{ color: item.color }} />
                    <div className="space-y-1">
                       <p className="font-mono text-[9px] uppercase tracking-widest text-text-4">{item.label}</p>
                       <p className="text-2xl font-black text-text-1">{item.count}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* World Side (The Orbit) */}
          <div className="relative h-[600px] flex items-center justify-center">
            <motion.div 
              style={{ rotate, scale }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Central Core */}
              <div className="absolute w-24 h-24 rounded-full bg-accent-cyan/10 blur-2xl animate-pulse" />
              <div className="absolute w-4 h-4 rounded-full bg-accent-cyan shadow-[0_0_30px_var(--accent-cyan)] z-20" />
              
              {/* Orbital Rings (Visual only) */}
              {[140, 240, 340].map((r, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full border border-text-1/[0.05] pointer-events-none"
                  style={{ width: r * 2, height: r * 2 }}
                />
              ))}

              {/* CORE RING (Fastest) */}
              {orbit.core.map((tech, i) => (
                <OrbitItem 
                  key={tech} 
                  text={tech} 
                  radius={140} 
                  speed={20} 
                  index={i} 
                  total={orbit.core.length} 
                  onSelect={handleSelect}
                  active={activeTech === tech}
                />
              ))}

              {/* FRAMEWORKS RING (Medium) */}
              {orbit.frameworks.map((tech, i) => (
                <OrbitItem 
                  key={tech} 
                  text={tech} 
                  radius={240} 
                  speed={40} 
                  index={i} 
                  total={orbit.frameworks.length} 
                  onSelect={handleSelect}
                  active={activeTech === tech}
                />
              ))}

              {/* TOOLS RING (Slowest) */}
              {orbit.tools.map((tech, i) => (
                <OrbitItem 
                  key={tech} 
                  text={tech} 
                  radius={340} 
                  speed={60} 
                  index={i} 
                  total={orbit.tools.length} 
                  onSelect={handleSelect}
                  active={activeTech === tech}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
