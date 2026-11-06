"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";

export type RoadmapEntry = {
  id: string | number;
  type: string;
  title: string;
  eventDate: string;
  description: string;
};

type RoadmapProps = {
  entries: RoadmapEntry[];
  labels: { experience: string; education: string };
  variant?: "default" | "minimal";
};

export default function Roadmap({ entries, labels, variant = "default" }: RoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scrolling through the container to animate the central line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-5xl py-10">
      
      {/* The Central Line Background */}
      <div className="absolute bottom-0 left-8 top-0 w-px bg-white/10 md:left-1/2 md:-ml-[0.5px]" />
      
      {/* The Animated Progress Line */}
      <motion.div 
        className="absolute left-8 top-0 w-px bg-gradient-to-b from-[#9A71FF] via-[#9A71FF]/80 to-white/10 md:left-1/2 md:-ml-[0.5px]" 
        style={{ height: "100%", scaleY: smoothProgress, transformOrigin: "top" }}
      />

      <div className="relative z-10 flex flex-col gap-10 sm:gap-14">
        {entries.map((entry, index) => {
          const Icon = entry.type === "experience" ? BriefcaseBusiness : GraduationCap;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* Central Node (Dot/Icon) */}
              <div className="absolute left-8 top-6 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#9A71FF]/40 bg-[#17161e] text-[#9A71FF] shadow-[0_0_15px_rgba(154,113,255,0.25)] transition-transform duration-300 group-hover:scale-110 md:left-1/2 md:top-1/2">
                <Icon className="h-4 w-4" />
              </div>

              {/* Mobile Layout: Content goes right of the line */}
              <div className="ml-16 sm:ml-20 flex flex-col md:hidden">
                <div className="rounded-2xl border border-white/10 bg-[#17161e] p-5 sm:p-6 transition-all duration-300 hover:border-white/20">
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-xs font-semibold text-[#9A71FF]">
                      {entry.type === "experience" ? labels.experience : labels.education}
                    </span>
                    <span className="text-xs text-[#797681]">
                      {entry.eventDate}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#f3f1f7] mb-3">{entry.title}</h3>
                  {variant !== "minimal" && (
                    <p className="text-sm leading-relaxed text-[#797681]">
                      {entry.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Desktop Layout: Alternating sides */}
              {/* Left Side */}
              <div className={`hidden w-[calc(50%-3.5rem)] md:flex md:flex-col ${isEven ? 'text-right items-end' : 'text-left items-start'}`}>
                {isEven ? (
                  <div className="w-full rounded-2xl border border-white/10 bg-[#17161e] p-6 text-left transition-all duration-300 hover:border-white/20">
                    <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.06]">
                      <span className="text-xs font-semibold text-[#9A71FF]">
                        {entry.type === "experience" ? labels.experience : labels.education}
                      </span>
                      <span className="text-xs text-[#797681]">
                        {entry.eventDate}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#f3f1f7] mb-3">{entry.title}</h3>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-[#797681]">
                        {entry.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-right w-full pr-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9A71FF] block mb-1">
                      {entry.type === "experience" ? labels.experience : labels.education}
                    </span>
                    <span className="text-sm font-medium text-[#797681]">
                      {entry.eventDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Side */}
              <div className={`hidden w-[calc(50%-3.5rem)] md:flex md:flex-col ${!isEven ? 'text-left items-start' : 'text-right items-end'}`}>
                {!isEven ? (
                  <div className="w-full rounded-2xl border border-white/10 bg-[#17161e] p-6 text-left transition-all duration-300 hover:border-white/20">
                    <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.06]">
                      <span className="text-xs font-semibold text-[#9A71FF]">
                        {entry.type === "experience" ? labels.experience : labels.education}
                      </span>
                      <span className="text-xs text-[#797681]">
                        {entry.eventDate}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#f3f1f7] mb-3">{entry.title}</h3>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-[#797681]">
                        {entry.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-left w-full pl-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9A71FF] block mb-1">
                      {entry.type === "experience" ? labels.experience : labels.education}
                    </span>
                    <span className="text-sm font-medium text-[#797681]">
                      {entry.eventDate}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
