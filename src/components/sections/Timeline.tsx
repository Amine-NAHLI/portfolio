"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GraduationCap, Code, Wrench, Star } from "lucide-react";
import type { TimelineEvent } from "@/lib/github";
import { cn } from "@/lib/utils";

const IconMap = {
  education: GraduationCap,
  project: Code,
  skill: Wrench,
  milestone: Star,
};

const TimelineItem = ({
  event,
  index,
}: {
  event: TimelineEvent;
  index: number;
}) => {
  const isLeft = index % 2 === 0;
  const Icon = IconMap[event.type] || Star;

  return (
    <div className="relative mb-12 md:mb-20 last:mb-0">
      <div className={cn("flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0", isLeft ? "md:flex-row" : "md:flex-row-reverse")}>
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "w-full md:w-[44%] p-6 rounded-2xl bg-bg-secondary/50 border backdrop-blur-sm group transition-all duration-300",
            event.highlight ? "border-accent-cyan/40 shadow-[0_0_20px_rgba(6,182,212,0.08)]" : "border-white/10 hover:border-white/20"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("p-2 rounded-lg bg-white/5", event.highlight ? "text-accent-cyan" : "text-text-muted")}>
              <Icon size={18} />
            </div>
            <h3 className={cn("text-base font-bold transition-colors", event.highlight ? "text-accent-cyan" : "text-white group-hover:text-accent-cyan")}>
              {event.title}
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed pl-11">{event.description}</p>
        </motion.div>

        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "rounded-full bg-bg border-2 flex items-center justify-center font-mono font-bold text-[10px]",
              event.highlight ? "w-12 h-12 border-accent-cyan text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "w-9 h-9 border-white/20 text-text-muted"
            )}
          >
            {event.year.slice(-2)}
          </motion.div>
        </div>
        <div className="hidden md:block w-[44%]" />
      </div>
    </div>
  );
};

const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="timeline" className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="section-label">// 05 ─ THE JOURNEY</span>
            <div className="h-[1px] flex-1 max-w-20 bg-accent-cyan/20" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted font-mono text-sm"
          >
            Generated from GitHub repository history and profile milestones.
          </motion.p>
        </div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5">
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{
                scaleY,
                height: "100%",
                background: "linear-gradient(to bottom, #06b6d4, #6366f1, #a855f7)",
              }}
            />
          </div>
          <div className="relative pl-14 md:pl-0">
            {events.map((event, i) => (
              <TimelineItem key={`${event.year}-${event.title}`} event={event} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
