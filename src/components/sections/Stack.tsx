"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Skill } from "@/lib/github";
import { stackFilter } from "@/lib/stackFilter";

const EASE = [0.16, 1, 0.3, 1] as const;
const VP   = { once: true, margin: "-100px" } as const;

/* ── Category config ─────────────────────────────────────────────── */

const CAT: Record<string, { color: string; bg: string; border: string; label: string }> = {
  Security:     { color: "#06b6d4", bg: "rgba(6,182,212,0.12)",  border: "rgba(6,182,212,0.25)",  label: "Security"    },
  "Full-Stack": { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", label: "Full-Stack"  },
  AI:           { color: "#a855f7", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", label: "AI / ML"     },
  Experiments:  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", label: "Experiments" },
};
const FALLBACK = CAT.Security;

/* ── Tooltip ─────────────────────────────────────────────────────── */

const Tooltip = ({ name, category, description, color }: {
  name: string; category: string; description: string; color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 6, scale: 0.95 }}
    transition={{ duration: 0.15, ease: EASE }}
    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20 pointer-events-none"
    style={{ minWidth: 160 }}
  >
    <div className="rounded-[10px] bg-bg-highest border border-white/10 p-3 shadow-2xl text-center">
      <p className="text-[13px] font-semibold text-text-primary mb-0.5">{name}</p>
      <p className="text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color }}>{category}</p>
      <p className="text-[11px] text-text-secondary leading-snug">{description}</p>
    </div>
    {/* Arrow */}
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
      style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(31,31,46,0.95)" }}
      aria-hidden="true"
    />
  </motion.div>
);

/* ── Tech node ───────────────────────────────────────────────────── */

interface TechNode {
  name: string;
  category: string;
  size: number;
  color: string;
  bg: string;
  border: string;
  description: string;
}

const Node = ({
  node,
  activeFilter,
  onSelect,
}: {
  node: TechNode;
  activeFilter: string | null;
  onSelect: (name: string | null) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const isFiltered = activeFilter !== null && activeFilter !== node.name;
  const isActive   = activeFilter === node.name;

  return (
    <div className="relative flex-shrink-0" style={{ width: node.size, height: node.size }}>
      <AnimatePresence>{hovered && !isFiltered && (
        <Tooltip name={node.name} category={node.category} description={node.description} color={node.color} />
      )}</AnimatePresence>

      <button
        aria-label={`Filter by ${node.name}`}
        aria-pressed={isActive}
        className="constellation-node w-full h-full rounded-full flex items-center justify-center border text-center cursor-pointer select-none"
        style={{
          background: isActive ? node.color : node.bg,
          borderColor: isActive ? node.color : node.border,
          opacity: isFiltered ? 0.2 : 1,
          filter: isFiltered ? "saturate(0)" : "none",
        }}
        onClick={() => onSelect(isActive ? null : node.name)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <span
          className="font-mono font-semibold leading-tight px-1 text-center"
          style={{
            fontSize: Math.max(9, node.size * 0.18),
            color: isActive ? "#030712" : node.color,
          }}
        >
          {node.name}
        </span>
      </button>
    </div>
  );
};

/* ── Stack ───────────────────────────────────────────────────────── */

export default function Stack({ skills }: { skills: Skill[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const nodes: TechNode[] = useMemo(() =>
    skills.flatMap((skill) => {
      const c = CAT[skill.category] ?? FALLBACK;
      return skill.techs.map((tech, i) => ({
        name: tech,
        category: c.label,
        size: Math.round(44 + (skill.level / 100) * 32 + (i % 3) * 4),
        color: c.color,
        bg: c.bg,
        border: c.border,
        description: skill.description,
      }));
    }),
    [skills]
  );

  const handleSelect = (name: string | null) => {
    setActiveFilter(name);
    stackFilter.emit(name);
  };

  const legend = useMemo(() =>
    Object.entries(CAT).filter(([cat]) => skills.some((s) => s.category === cat)),
    [skills]
  );

  return (
    <section id="stack" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          number="03"
          label="Stack"
          heading={<>Tools of the <span className="gradient-text">trade.</span></>}
          subheading="Click any tech to filter projects below. Sized by proficiency."
        />

        {/* Constellation — desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: EASE }}
          className="hidden md:block"
        >
          <div className="constellation-group flex flex-wrap gap-3 md:gap-4 items-center justify-start pb-8">
            {nodes.map((node, i) => (
              <motion.div
                key={`${node.category}-${node.name}`}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VP}
                transition={{ delay: i * 0.03, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <Node node={node} activeFilter={activeFilter} onSelect={handleSelect} />
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 mt-2 pt-6 border-t border-white/5">
            {legend.map(([, c]) => (
              <div key={c.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c.color }} aria-hidden="true" />
                <span className="text-[11px] font-mono text-text-faint uppercase tracking-wider">{c.label}</span>
              </div>
            ))}
            {activeFilter && (
              <button
                onClick={() => handleSelect(null)}
                className="text-[11px] font-mono text-accent-cyan/70 hover:text-accent-cyan underline underline-offset-4 transition-colors ml-auto"
              >
                clear filter
              </button>
            )}
          </div>
        </motion.div>

        {/* Mobile — tagged list */}
        <div className="md:hidden">
          {skills.map((skill) => {
            const c = CAT[skill.category] ?? FALLBACK;
            return (
              <div key={skill.name} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} aria-hidden="true" />
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: c.color }}>{skill.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-full text-[11px] font-mono"
                      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
