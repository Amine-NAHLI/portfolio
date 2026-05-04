"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useInView } from "framer-motion";
import { GraduationCap, Code, Wrench, Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { TimelineEvent } from "@/lib/github";
import { cn } from "@/lib/utils";

const IconMap = {
  education: GraduationCap,
  project: Code,
  skill: Wrench,
  milestone: Star,
} as const;

const TimelineItem = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const Icon = IconMap[event.type] ?? Star;

  return (
    <div ref={ref} className="relative pl-12 md:pl-0 grid grid-cols-1 md:grid-cols-2 gap-12 mb-40 last:mb-0">
      {/* Left side: Year (Desktop only) */}
      <div className="hidden md:flex justify-end pr-24 items-start pt-2">
        <motion.span
          animate={{ 
            opacity: isInView ? 1 : 0.1, 
            scale: isInView ? 1 : 0.8,
            x: isInView ? 0 : 20
          }}
          className="text-9xl font-black tracking-tighter text-text-1 tabular-nums transition-all duration-1000"
        >
          {event.year}
        </motion.span>
      </div>

      {/* Right side: Content */}
      <div className="relative">
        {/* Mobile Year */}
        <span className="md:hidden block text-6xl font-black text-text-1/10 mb-6">{event.year}</span>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "p-10 rounded-[2.5rem] border transition-all duration-1000",
            isInView ? "bg-bg-1 border-white/10 shadow-3xl" : "bg-transparent border-white/5 opacity-40"
          )}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-1000",
              isInView ? "bg-cyan text-bg-0" : "bg-white/5 text-text-4"
            )}>
              <Icon size={20} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{event.title}</h3>
          </div>
          
          <p className="text-text-3 text-lg leading-relaxed mb-8">
            {event.description}
          </p>

          {event.highlight && (
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-cyan">
              <Star size={12} />
              Featured Achievement
            </div>
          )}
        </motion.div>

        {/* Node on the line */}
        <div className="absolute left-[-48px] md:left-[-6px] top-12 w-3 h-3 rounded-full border-2 border-bg-0 z-10 bg-white/10 overflow-hidden">
          <motion.div 
            animate={{ scale: isInView ? 1.5 : 0 }}
            className="w-full h-full bg-cyan shadow-[0_0_10px_var(--color-accent-cyan)]"
          />
        </div>
      </div>
    </div>
  );
};

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

  return (
    <section id="timeline" className="relative py-40 bg-bg-0">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
          <div className="space-y-4">
            <span className="font-mono text-cyan text-xs uppercase tracking-[0.5em]">History.log()</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              The <span className="text-text-4">Journey.</span>
            </h2>
          </div>
          <p className="max-w-md text-text-3 text-lg leading-relaxed">
            A chronological mapping of professional evolution, academic milestones, and technical breakthroughs.
          </p>
        </div>

        <div ref={containerRef} className="relative max-w-6xl mx-auto">
          {/* Central Line (Desktop) */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/5 md:-translate-x-1/2">
            <motion.div
              style={{ scaleY }}
              className="absolute top-0 left-0 right-0 h-full origin-top bg-gradient-to-b from-cyan via-indigo to-purple shadow-[0_0_20px_var(--color-accent-cyan)]"
            />
          </div>

          <div className="relative pt-12">
            {events.map((event, i) => (
              <TimelineItem key={`${event.year}-${event.title}`} event={event} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
