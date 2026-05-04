"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GraduationCap, Code, Wrench, Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import type { TimelineEvent } from "@/lib/github";
import { cn } from "@/lib/utils";

const IconMap = {
  education: GraduationCap,
  project:   Code,
  skill:     Wrench,
  milestone: Star,
} as const;

const TimelineItem = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const isLeft = index % 2 === 0;
  const Icon = IconMap[event.type] ?? Star;

  return (
    <li className="relative mb-12 md:mb-16 last:mb-0">
      <div className={cn(
        "flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0",
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -32 : 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full md:w-[46%] p-5 rounded-2xl border backdrop-blur-sm transition-all duration-[400ms] group",
            event.highlight
              ? "border-accent-cyan/35 bg-accent-cyan/5 shadow-[0_0_24px_rgba(6,182,212,0.07)]"
              : "border-white/8 bg-bg-secondary/50 hover:border-white/16"
          )}
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className={cn(
              "p-1.5 rounded-lg",
              event.highlight ? "bg-accent-cyan/15 text-accent-cyan" : "bg-white/5 text-text-muted group-hover:text-accent-cyan transition-colors duration-[250ms]"
            )}>
              <Icon size={16} aria-hidden="true" />
            </div>
            <h3 className={cn(
              "text-sm font-semibold",
              event.highlight ? "text-accent-cyan" : "text-text-primary"
            )}>
              {event.title}
            </h3>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed pl-9">{event.description}</p>
        </motion.div>

        {/* Year node */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-5 md:top-1/2 md:-translate-y-1/2 z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            aria-label={event.year}
            className={cn(
              "rounded-full bg-bg border-2 flex items-center justify-center font-mono font-bold text-[10px]",
              event.highlight
                ? "w-12 h-12 border-accent-cyan text-accent-cyan shadow-[0_0_16px_rgba(6,182,212,0.25)]"
                : "w-9 h-9 border-white/16 text-text-faint"
            )}
          >
            {event.year}
          </motion.div>
        </div>

        <div className="hidden md:block w-[46%]" aria-hidden="true" />
      </div>
    </li>
  );
};

const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section id="timeline" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          number="04"
          label="Journey"
          heading={<>The <span className="gradient-text">story so far.</span></>}
          subheading="Generated from GitHub repository history and profile milestones."
        />

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Scroll-synced line */}
          <div aria-hidden="true" className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/5">
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ scaleY, height: "100%", background: "linear-gradient(to bottom, #06b6d4, #6366f1, #a855f7)" }}
            />
          </div>

          <ol aria-label="Career timeline" className="relative pl-14 md:pl-0">
            {events.map((event, i) => (
              <TimelineItem key={`${event.year}-${event.title}`} event={event} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
