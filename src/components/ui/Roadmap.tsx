"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import WindingRoadOverlay from "@/components/ui/WindingRoad";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-5xl py-12 sm:py-16">
      <WindingRoadOverlay wrapperRef={wrapperRef} pinRefs={pinRefs} itemCount={entries.length} />

      <div className="relative z-10 flex flex-col gap-20 sm:gap-24">
        {entries.map((entry, index) => {
          const Icon = entry.type === "experience" ? BriefcaseBusiness : GraduationCap;
          const isEven = index % 2 === 0;
          const typeLabel = entry.type === "experience" ? labels.experience : labels.education;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0.2 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="group relative flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* Waypoint Pin directly on the winding road apex */}
              <div
                ref={(el) => {
                  pinRefs.current[index] = el;
                }}
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-full border border-accent/45 bg-bg-page text-accent shadow-[0_0_14px_color-mix(in_srgb,var(--accent)_18%,transparent)] transition-[transform,border-color,box-shadow] duration-300 group-hover:scale-110 group-hover:border-accent/80 group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_30%,transparent)] ${
                  isEven ? "left-[88%] md:left-[62%]" : "left-[12%] md:left-[38%]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-accent/15"
                />
                <Icon className="h-4 w-4" />
              </div>

              {/* Mobile Layout: alternating left/right frameless milestones */}
              <div
                className={`flex flex-col md:hidden w-[72%] py-1 ${
                  isEven ? "mr-auto" : "ml-auto"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-accent">{typeLabel}</span>
                    <span className="text-xs font-mono text-text-muted">{entry.eventDate}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{entry.title}</h3>
                  {variant !== "minimal" && (
                    <p className="text-sm leading-relaxed text-text-secondary">{entry.description}</p>
                  )}
                </div>
              </div>

              {/* Desktop Left Side */}
              <div
                className={`hidden md:flex md:flex-col ${
                  isEven ? "w-[50%] pr-4 lg:pr-6 items-end text-right" : "w-[30%] pr-4 lg:pr-6 items-end text-right"
                }`}
              >
                {isEven ? (
                  <div className="w-full py-1 text-right">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {entry.title}
                    </h3>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-text-secondary">{entry.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 w-full">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
                      {typeLabel}
                    </span>
                    <span className="font-mono text-sm font-medium text-text-muted">
                      {entry.eventDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Desktop Right Side */}
              <div
                className={`hidden md:flex md:flex-col ${
                  !isEven ? "w-[50%] pl-4 lg:pl-6 items-start text-left" : "w-[30%] pl-4 lg:pl-6 items-start text-left"
                }`}
              >
                {!isEven ? (
                  <div className="w-full py-1 text-left">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {entry.title}
                    </h3>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-text-secondary">{entry.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 w-full">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
                      {typeLabel}
                    </span>
                    <span className="font-mono text-sm font-medium text-text-muted">
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
