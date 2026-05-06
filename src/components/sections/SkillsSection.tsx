"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Code2, Terminal, Shield, Brain, Cpu, Database, Server, Layout, 
  Globe, Cloud, Lock, Zap, Layers, Box, GitBranch, Search, 
  Settings, Monitor, Smartphone, Gauge, Command
} from "lucide-react";

interface SupabaseSkill {
  id: string;
  name: string;
  category: string;
}

const getSkillIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("security") || n.includes("pen") || n.includes("audit") || n.includes("hack")) return { icon: Shield, color: "#ef4444" };
  if (n.includes("crypto") || n.includes("hash") || n.includes("vault") || n.includes("lock")) return { icon: Lock, color: "#f59e0b" };
  if (n.includes("python") || n.includes("java") || n.includes("php") || n.includes("code") || n.includes("script")) return { icon: Code2, color: "#38bdf8" };
  if (n.includes("rust") || n.includes("go") || n.includes("c++")) return { icon: Zap, color: "#facc15" };
  if (n.includes("node") || n.includes("deno") || n.includes("backend")) return { icon: Server, color: "#22c55e" };
  if (n.includes("sql") || n.includes("db") || n.includes("mongo") || n.includes("data") || n.includes("redis")) return { icon: Database, color: "#6366f1" };
  if (n.includes("react") || n.includes("next") || n.includes("vue") || n.includes("angular") || n.includes("frontend")) return { icon: Layout, color: "#60a5fa" };
  if (n.includes("css") || n.includes("sass") || n.includes("tailwind") || n.includes("ui")) return { icon: Monitor, color: "#38bdf8" };
  if (n.includes("html") || n.includes("web") || n.includes("browser")) return { icon: Globe, color: "#f97316" };
  if (n.includes("ai") || n.includes("machine") || n.includes("learning") || n.includes("vision") || n.includes("brain")) return { icon: Brain, color: "#a855f7" };
  if (n.includes("tensor") || n.includes("gpu") || n.includes("cuda") || n.includes("model")) return { icon: Cpu, color: "#ec4899" };
  if (n.includes("docker") || n.includes("container") || n.includes("k8s") || n.includes("kubernetes")) return { icon: Box, color: "#0ea5e9" };
  if (n.includes("cloud") || n.includes("aws") || n.includes("azure") || n.includes("gcp")) return { icon: Cloud, color: "#0ea5e9" };
  if (n.includes("linux") || n.includes("unix") || n.includes("bash") || n.includes("shell") || n.includes("cli")) return { icon: Terminal, color: "#ffffff" };
  return { icon: Terminal, color: "var(--accent-cyan)" };
};

const SkillModule = ({ name, delay }: { name: string; delay: number }) => {
  const { icon: Icon, color } = getSkillIcon(name);
  
  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [0, -15, 0] }}
      transition={{ 
        duration: 4 + Math.random() * 2, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      className="group relative flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-bg-1/40 dark:bg-white/[0.02] border border-bg-3 dark:border-white/[0.08] backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:border-white/40 overflow-hidden"
    >
      {/* Background Active Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* Module ID / Metadata (Decorative) */}
      <div className="absolute top-2 left-8 flex gap-1 opacity-[0.2]">
         <div className="w-1 h-1 rounded-full bg-white" />
         <div className="w-1 h-1 rounded-full bg-white" />
         <span className="text-[6px] font-mono uppercase tracking-tighter">Active_Mod</span>
      </div>

      <div 
        className="flex items-center justify-center w-12 h-12 rounded-xl bg-bg-2 dark:bg-white/5 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]"
        style={{ color: color }}
      >
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-sm md:text-base font-black text-text-1 tracking-tighter uppercase group-hover:text-white transition-colors">
          {name}
        </span>
        <div className="flex items-center gap-2">
           <div className="h-1 w-12 bg-bg-3 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent-cyan"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                style={{ backgroundColor: color }}
              />
           </div>
           <span className="text-[8px] font-mono text-text-4 uppercase">Syncing...</span>
        </div>
      </div>

      {/* Scanning Light */}
      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:animate-[scan_2s_linear_infinite]" />
    </motion.div>
  );
};

export default function SkillsSection({ skills }: { skills: SupabaseSkill[] }) {
  const row1 = useMemo(() => {
    const s = [...skills].sort(() => Math.random() - 0.5);
    return [...s, ...s, ...s, ...s];
  }, [skills]);

  const row2 = useMemo(() => {
    const s = [...skills].sort(() => Math.random() - 0.5);
    return [...s, ...s, ...s, ...s];
  }, [skills]);

  if (skills.length === 0) return null;

  return (
    <section id="stack" className="py-48 bg-transparent relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
                 <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent-cyan font-black">Tactical_Core_v7.4</span>
              </div>
              <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none uppercase">
                 Technical <br /> <span className="text-text-4/20 dark:text-white/10 stroke-text-1">Arsenal.</span>
              </h2>
           </div>
           <div className="flex flex-col gap-4 border-l-2 border-accent-cyan pl-8 py-2">
              <p className="max-w-sm text-[11px] uppercase tracking-[0.2em] text-text-3 font-mono leading-relaxed">
                 High-fidelity operational capabilities across cyber security, full-stack architecture, and machine intelligence.
              </p>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-bg-3" />
                 <div className="w-2 h-2 rounded-full bg-bg-3" />
                 <div className="w-2 h-2 rounded-full bg-accent-cyan" />
              </div>
           </div>
        </div>
      </div>

      {/* Vortex Container */}
      <div className="relative flex flex-col gap-12 [perspective:3000px] py-20">
        {/* Row 1 */}
        <div className="flex items-center [transform:rotateX(20deg)_rotateY(-10deg)_translateZ(0px)] opacity-95">
          <motion.div 
            className="flex gap-10 pr-10"
            animate={{ x: ["-25%", "0%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {row1.map((skill, idx) => (
              <SkillModule key={`v1-${skill.id}-${idx}`} name={skill.name} delay={idx * 0.2} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center [transform:rotateX(-20deg)_rotateY(10deg)_translateZ(100px)] opacity-90">
          <motion.div 
            className="flex gap-10 pr-10"
            animate={{ x: ["0%", "-25%"] }}
            transition={{ ease: "linear", duration: 60, repeat: Infinity }}
          >
            {row2.map((skill, idx) => (
              <SkillModule key={`v2-${skill.id}-${idx}`} name={skill.name} delay={idx * 0.3} />
            ))}
          </motion.div>
        </div>

        {/* Depth Fog */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-bg-0 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-bg-0 to-transparent z-20 pointer-events-none" />
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
      `}</style>
    </section>
  );
}
