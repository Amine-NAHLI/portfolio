"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { GraduationCap, Code, Wrench, Star } from "lucide-react";
import { timeline, TimelineEvent } from "@/data/timeline";
import { cn } from "@/lib/utils";

const IconMap = {
  education: GraduationCap,
  project: Code,
  skill: Wrench,
  milestone: Star,
};

const TimelineItem = ({ event, index, isLast }: { event: TimelineEvent; index: number; isLast: boolean }) => {
  const isLeft = index % 2 === 0;
  const Icon = IconMap[event.type];

  return (
    <div className="relative mb-12 md:mb-24 last:mb-0">
      {/* Mobile view and Desktop central line logic is handled in the parent */}
      <div className={cn(
        "flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0",
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "w-full md:w-[42%] p-6 rounded-2xl bg-bg-secondary/50 border backdrop-blur-md relative group transition-all duration-300",
            event.highlight 
              ? "border-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
              : "border-white/10 hover:border-white/20"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "p-2 rounded-lg bg-white/5",
              event.highlight ? "text-accent-cyan" : "text-text-muted"
            )}>
              <Icon size={20} />
            </div>
            <h3 className={cn(
              "text-lg font-bold transition-colors",
              event.highlight ? "text-accent-cyan" : "text-white group-hover:text-accent-cyan"
            )}>
              {event.title}
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {event.description}
          </p>
        </motion.div>

        {/* Year Badge on the line */}
        <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              "rounded-full bg-bg border-2 flex items-center justify-center font-mono font-bold text-[10px]",
              event.highlight 
                ? "w-10 h-10 border-accent-cyan text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                : "w-8 h-8 border-white/20 text-text-muted"
            )}
          >
            {event.year}
          </motion.div>
        </div>

        {/* Empty space for zigzag */}
        <div className="hidden md:block w-[42%]" />
      </div>
    </div>
  );
};

const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="timeline" className="py-24 bg-bg overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="text-accent-cyan font-mono font-bold">// 05</span>
            <div className="h-[1px] w-12 bg-accent-cyan/30" />
            <h2 className="text-2xl font-bold tracking-widest uppercase">The Journey</h2>
          </motion.div>
        </div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-accent-cyan to-accent-purple origin-top"
              style={{ scaleY: pathLength, height: "100%" }}
            />
          </div>

          {/* Timeline Events */}
          <div className="relative pl-10 md:pl-0">
            {timeline.map((event, i) => (
              <TimelineItem 
                key={`${event.year}-${event.title}`} 
                event={event} 
                index={i} 
                isLast={i === timeline.length - 1} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
