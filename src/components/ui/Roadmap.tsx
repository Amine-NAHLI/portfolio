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
      <div className="absolute bottom-0 left-8 top-0 w-px bg-border md:left-1/2 md:-ml-[0.5px]" />
      
      {/* The Animated Progress Line */}
      <motion.div 
        className="absolute left-8 top-0 w-px bg-accent md:left-1/2 md:-ml-[0.5px]" 
        style={{ height: "100%", scaleY: smoothProgress, transformOrigin: "top" }}
      />

      <div className="relative z-10 flex flex-col gap-12 sm:gap-16">
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
              <div className="absolute left-8 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-2 items-center justify-center rounded-full border-2 border-accent bg-bg-page text-accent shadow-[0_0_10px_rgba(var(--color-accent),0.3)] transition-transform duration-300 group-hover:scale-110 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                <Icon className="h-4 w-4" />
              </div>

              {/* Mobile Layout: Content goes right of the line */}
              <div className="ml-20 flex flex-col md:hidden">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
                  {entry.eventDate}
                </span>
                <h3 className="text-xl font-bold text-text-primary mb-1">{entry.title}</h3>
                <span className="text-sm font-medium text-text-muted mb-4 uppercase tracking-widest">
                  {entry.type === "experience" ? labels.experience : labels.education}
                </span>
                {variant !== "minimal" && (
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {entry.description}
                  </p>
                )}
              </div>

              {/* Desktop Layout: Alternating sides */}
              {/* Left Side (Empty if odd, Content/Date if even) */}
              <div className={`hidden w-[calc(50%-3rem)] md:flex md:flex-col ${isEven ? 'text-right items-end' : 'text-left items-start'}`}>
                {isEven ? (
                  <>
                    <h3 className="text-2xl font-bold text-text-primary mb-1">{entry.title}</h3>
                    <span className="text-sm font-medium text-text-muted mb-4 uppercase tracking-widest">
                      {entry.type === "experience" ? labels.experience : labels.education}
                    </span>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-text-secondary text-right">
                        {entry.description}
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-semibold uppercase tracking-widest text-accent mt-1">
                    {entry.eventDate}
                  </span>
                )}
              </div>

              {/* Right Side (Empty if even, Content/Date if odd) */}
              <div className={`hidden w-[calc(50%-3rem)] md:flex md:flex-col ${!isEven ? 'text-left items-start' : 'text-right items-end'}`}>
                {!isEven ? (
                  <>
                    <h3 className="text-2xl font-bold text-text-primary mb-1">{entry.title}</h3>
                    <span className="text-sm font-medium text-text-muted mb-4 uppercase tracking-widest">
                      {entry.type === "experience" ? labels.experience : labels.education}
                    </span>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-text-secondary text-left">
                        {entry.description}
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-sm font-semibold uppercase tracking-widest text-accent mt-1">
                    {entry.eventDate}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
