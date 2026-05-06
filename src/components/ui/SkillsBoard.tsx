"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Constants ────────────────────────────────────────────────── */

const CATEGORIES = {
  Languages: { color: "#4FC3F7", label: "Languages" },
  Frontend: { color: "#69F0AE", label: "Frontend" },
  Backend: { color: "#FF8A65", label: "Backend" },
  AI_ML: { color: "#CE93D8", label: "AI/ML" },
  Database: { color: "#FFF176", label: "Database" },
  DevOps: { color: "#80DEEA", label: "DevOps" },
};

const SKILLS = [
  // Languages
  { name: "TypeScript", category: "Languages", x: 15, y: 15 },
  { name: "JavaScript", category: "Languages", x: 32, y: 12 },
  { name: "Python", category: "Languages", x: 22, y: 28 },
  { name: "Java", category: "Languages", x: 45, y: 18 },
  { name: "SQL", category: "Languages", x: 12, y: 40 },
  { name: "Bash", category: "Languages", x: 28, y: 45 },
  
  // Frontend
  { name: "React", category: "Frontend", x: 60, y: 15 },
  { name: "Next.js", category: "Frontend", x: 75, y: 10 },
  { name: "Tailwind CSS", category: "Frontend", x: 88, y: 18 },
  { name: "Three.js", category: "Frontend", x: 65, y: 28 },
  { name: "Framer Motion", category: "Frontend", x: 82, y: 32 },

  // Backend
  { name: "Node.js", category: "Backend", x: 15, y: 65 },
  { name: "FastAPI", category: "Backend", x: 30, y: 72 },
  { name: "Spring Boot", category: "Backend", x: 45, y: 60 },
  { name: "REST API", category: "Backend", x: 22, y: 82 },
  { name: "JWT Auth", category: "Backend", x: 38, y: 88 },

  // AI/ML
  { name: "YOLO", category: "AI_ML", x: 65, y: 65 },
  { name: "PyTorch", category: "AI_ML", x: 80, y: 60 },
  { name: "OpenCV", category: "AI_ML", x: 72, y: 75 },
  { name: "MediaPipe", category: "AI_ML", x: 85, y: 80 },

  // Database
  { name: "MongoDB", category: "Database", x: 48, y: 42 },
  { name: "MySQL", category: "Database", x: 55, y: 55 },

  // DevOps
  { name: "Git", category: "DevOps", x: 85, y: 45 },
  { name: "Docker", category: "DevOps", x: 72, y: 52 },
  { name: "CI/CD", category: "DevOps", x: 92, y: 58 },
];

/* ─── Components ─────────────────────────────────────────────── */

const Chip = ({ skill, active, hovered, onHover, onClick, dim }: any) => {
  const catColor = CATEGORIES[skill.category as keyof typeof CATEGORIES].color;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: dim ? 0.3 : 1, 
        scale: hovered ? 1.05 : 1,
        borderColor: hovered ? catColor : "#1a3a1a"
      }}
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      className="absolute flex items-center bg-[#0d1a0d] border border-[#1a3a1a] rounded-sm transition-shadow duration-300 cursor-pointer overflow-hidden group shadow-lg"
      style={{
        left: `${skill.x}%`,
        top: `${skill.y}%`,
        width: "120px",
        height: "36px",
        transform: "translate(-50%, -50%)",
        boxShadow: hovered ? `0 0 15px ${catColor}40` : "none"
      }}
    >
      <div className="h-full w-[3px]" style={{ backgroundColor: catColor }} />
      <div className="flex-1 px-3">
        <span className="text-white font-bold text-[11px] uppercase tracking-wider block truncate">
          {skill.name}
        </span>
      </div>
      <div className="px-2">
        <div 
          className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] animate-pulse"
          style={{ backgroundColor: catColor }}
        />
      </div>
    </motion.div>
  );
};

const TraceLine = ({ start, end, color, active, pulse }: any) => {
  // 90-degree routing: startX,startY -> endX,startY -> endX,endY
  const path = `M ${start.x}% ${start.y}% L ${end.x}% ${start.y}% L ${end.x}% ${end.y}%`;
  
  return (
    <g>
      <path
        d={path}
        stroke="#1a3a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 0.8 : 0.4}
        className="transition-all duration-500"
      />
      {active && (
        <path
          d={path}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          className="blur-[2px]"
        />
      )}
      <motion.circle
        r="2"
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          offsetDistance: ["0%", "100%"]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2
        }}
        style={{ offsetPath: `path("${path.replace(/%/g, '')}")` }} // Simplified for motion path
      />
      {/* Real SVG animation for pulses since offsetPath with % is tricky */}
      <circle r="2" fill={color}>
        <animateMotion
          path={`M ${start.x},${start.y} L ${end.x},${start.y} L ${end.x},${end.y}`}
          dur={`${3 + Math.random() * 2}s`}
          repeatCount="indefinite"
          calcMode="linear"
        />
        <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
};

export default function SkillsBoard() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [tooltip, setTooltip] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Generate traces between same category skills
  const traces = useMemo(() => {
    const lines: any[] = [];
    const grouped = SKILLS.reduce((acc: any, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    Object.entries(grouped).forEach(([cat, items]: any) => {
      for (let i = 0; i < items.length - 1; i++) {
        lines.push({
          id: `${items[i].name}-${items[i+1].name}`,
          start: items[i],
          end: items[i+1],
          category: cat,
          color: CATEGORIES[cat as keyof typeof CATEGORIES].color
        });
      }
    });
    return lines;
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-30">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${
            activeFilter === "all" ? "bg-white text-bg-0 border-white" : "border-white/10 text-white/40 hover:text-white"
          }`}
        >
          All Systems
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeFilter === key 
                ? "bg-accent-indigo text-white border-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                : "border-white/10 text-white/40 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PCB Board Container */}
      <div 
        ref={boardRef}
        className="relative w-full aspect-[16/10] bg-[#0a1628] rounded-[2rem] border border-[#1a3a1a] overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26, 58, 26, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 58, 26, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      >
        {/* SVG Trace Layer */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {traces.map(trace => {
            const isDim = activeFilter !== "all" && trace.category !== activeFilter;
            const isHighlighted = hoveredSkill && (trace.start.name === hoveredSkill || trace.end.name === hoveredSkill);
            return (
              <TraceLine 
                key={trace.id} 
                start={trace.start} 
                end={trace.end} 
                color={trace.color} 
                active={isHighlighted || (activeFilter !== "all" && trace.category === activeFilter)}
                dim={isDim}
              />
            );
          })}
        </svg>

        {/* Chips Layer */}
        {SKILLS.map(skill => {
          const isDim = activeFilter !== "all" && skill.category !== activeFilter;
          const isHovered = hoveredSkill === skill.name;
          
          return (
            <Chip
              key={skill.name}
              skill={skill}
              hovered={isHovered}
              dim={isDim}
              onHover={setHoveredSkill}
              onClick={() => setTooltip(skill.category)}
            />
          );
        })}

        {/* HUD Decoration */}
        <div className="absolute top-6 left-8 pointer-events-none opacity-20">
          <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white">System: Nahli_OS_v4.2</p>
          <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white">Status: All Modules Operational</p>
        </div>
        <div className="absolute bottom-6 right-8 pointer-events-none opacity-20">
          <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white">Logic_Board_0x4FF2</p>
        </div>
      </div>

      {/* Category Tooltip Overlay */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setTooltip(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div className="bg-[#0d1a0d] border border-[#1a3a1a] p-8 rounded-[2rem] text-center max-w-sm shadow-2xl">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 block">Category Detected</span>
              <h3 className="text-3xl font-black text-white mb-2">{tooltip}</h3>
              <p className="text-white/60 text-sm mb-6">This component belongs to the {tooltip} logic sector.</p>
              <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">Close Entry</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
