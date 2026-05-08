"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SupabaseSkill {
  id: string;
  name: string;
  category: string;
}

const getIconUrl = (name: string) => {
  const n = name.toLowerCase().trim();
  const mapping: Record<string, string> = {
    "next.js": "nextjs", "nextjs": "nextjs", "react": "react",
    "node.js": "nodejs", "nodejs": "nodejs", "express": "express",
    "mongodb": "mongodb", "postgresql": "postgres", "postgres": "postgres",
    "supabase": "supabase", "tailwind": "tailwind", "typescript": "ts",
    "javascript": "js", "python": "py", "docker": "docker",
    "kubernetes": "kubernetes", "aws": "aws", "git": "git",
    "linux": "linux", "tensorflow": "tensorflow", "pytorch": "pytorch",
    "fastapi": "fastapi", "rust": "rust", "go": "go", "cpp": "cpp",
  };
  const slug = mapping[n] || n.replace(/[^a-z0-9]/g, "");
  return `https://skillicons.dev/icons?i=${slug}`;
};

const SkillModule = ({
  name,
  isBackRow,
}: {
  name: string;
  isBackRow?: boolean;
}) => {
  const iconUrl = getIconUrl(name);

  return (
    <div
      className={`relative flex items-center gap-2 md:gap-4 px-4 py-3 md:px-8 md:py-5 rounded-2xl md:rounded-[2rem] bg-bg-1/40 border border-[var(--border)] backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
        isBackRow ? "opacity-30 blur-[2px] scale-75 grayscale-[0.5]" : ""
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-bg-2 overflow-hidden p-1.5 md:p-2">
        <img
          src={iconUrl}
          alt={name}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://skillicons.dev/icons?i=code";
          }}
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] md:text-base font-black text-text-1 tracking-tighter uppercase leading-none">
          {name}
        </span>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="h-0.5 md:h-1 w-8 md:w-12 bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-cyan"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </div>
          <span className="text-[6px] md:text-[8px] font-mono text-text-4 uppercase">
            Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default function SkillsSection({ skills }: { skills: SupabaseSkill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 30 };
  const rotateXSpring = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [3, -3]),
    springConfig
  );
  const rotateYSpring = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
    springConfig
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const row1 = useMemo(() => {
    if (!mounted) return [];
    const s = [...skills].sort(() => Math.random() - 0.5);
    return [...s, ...s];
  }, [skills, mounted]);

  const row2 = useMemo(() => {
    if (!mounted) return [];
    const s = [...skills].sort(() => Math.random() - 0.5);
    return [...s, ...s];
  }, [skills, mounted]);

  if (skills.length === 0) return null;

  return (
    <section
      id="stack"
      className="py-48 bg-transparent relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 opacity-[var(--ghost-opacity)] grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="relative">
            <span className="ghost-text absolute -top-12 -left-4 text-[6rem] md:text-[10rem] font-black select-none pointer-events-none -z-10 uppercase tracking-tighter leading-none">
              Arsenal
            </span>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-accent-cyan rounded-full" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent-cyan font-black">
                Neural_Grid_v9.2
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
              Technical <br />
              <span className="ghost-stroke">
                Arsenal.
              </span>
            </h2>
          </div>

          <div className="max-w-sm lg:text-right flex flex-col lg:items-end gap-6">
            <div className="h-px w-24 bg-[var(--border)] hidden lg:block" />
            <p className="text-[10px] font-mono text-text-4 uppercase tracking-[0.3em] leading-relaxed">
              Deploying high-fidelity toolkits: Synthesizing full-stack
              engineering with aggressive security research and neural logic.
            </p>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-[8px] font-mono text-text-3 uppercase">
                Status: Fully_Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        style={{ rotateX: rotateXSpring, rotateY: rotateYSpring }}
        className="relative flex flex-col gap-16 py-20"
      >
        {/* Row 1 */}
        <div className="flex items-center overflow-hidden">
          <div className="flex gap-10 pr-10 skills-row-right" style={{ willChange: "transform" }}>
            {row1.map((skill, idx) => (
              <SkillModule key={`v1-${skill.id}-${idx}`} name={skill.name} />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center">
          <div className="flex gap-12 pr-12 skills-row-left" style={{ willChange: "transform" }}>
            {row2.map((skill, idx) => (
              <SkillModule key={`v2-${skill.id}-${idx}`} name={skill.name} isBackRow />
            ))}
          </div>
        </div>

        {/* Fade masks — use bg-bg-0 so they adapt to theme */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-bg-0 to-transparent z-40 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-bg-0 to-transparent z-40 pointer-events-none" />
      </motion.div>

      <style jsx global>{`
        @keyframes skills-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes skills-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .skills-row-left  { animation: skills-scroll-left  80s linear infinite; }
        .skills-row-right { animation: skills-scroll-right 60s linear infinite; }
      `}</style>
    </section>
  );
}
