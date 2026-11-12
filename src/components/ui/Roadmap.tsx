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
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-full border border-[#9A71FF]/45 bg-[#0A090E] text-[#9A71FF] shadow-[0_0_14px_rgba(154,113,255,0.16)] transition-[transform,border-color,box-shadow] duration-300 group-hover:scale-110 group-hover:border-[#9A71FF]/80 group-hover:shadow-[0_0_20px_rgba(154,113,255,0.3)] ${
                  isEven ? "left-[88%] md:left-[62%]" : "left-[12%] md:left-[38%]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#9A71FF]/15"
                />
                <Icon className="h-4 w-4" />
              </div>

              {/* Mobile Layout: alternating left/right cards matching desktop S-curve road */}
              <div
                className={`flex flex-col md:hidden w-[72%] ${
                  isEven ? "mr-auto" : "ml-auto"
                }`}
              >
                <div className="rounded-2xl border border-white/10 bg-[#17161e]/90 p-3.5 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#9A71FF]/35">
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.06]">
                    <span className="text-xs font-semibold text-[#9A71FF]">{typeLabel}</span>
                    <span className="text-xs font-mono text-[#797681]">{entry.eventDate}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#f3f1f7] mb-3">{entry.title}</h3>
                  {variant !== "minimal" && (
                    <p className="text-sm leading-relaxed text-[#797681]">{entry.description}</p>
                  )}
                </div>
              </div>

              {/* Desktop Left Side */}
              <div
                className={`hidden md:flex md:flex-col ${
                  isEven ? "w-[50%] pr-4 lg:pr-6 items-end text-left" : "w-[30%] pr-4 lg:pr-6 items-end text-right"
                }`}
              >
                {isEven ? (
                  <div className="w-full rounded-2xl border border-white/10 bg-[#17161e]/90 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-[#9A71FF]/40 hover:bg-[#1b1925]">
                    <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.06]">
                      <span className="text-xs font-semibold text-[#9A71FF]">{typeLabel}</span>
                      <span className="text-xs font-mono text-[#797681]">{entry.eventDate}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#f3f1f7] mb-3 group-hover:text-[#9A71FF] transition-colors">
                      {entry.title}
                    </h3>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-[#797681]">{entry.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 w-full">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#9A71FF] block mb-1">
                      {typeLabel}
                    </span>
                    <span className="font-mono text-sm font-medium text-[#797681]">
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
                  <div className="w-full rounded-2xl border border-white/10 bg-[#17161e]/90 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-[#9A71FF]/40 hover:bg-[#1b1925]">
                    <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-white/[0.06]">
                      <span className="text-xs font-semibold text-[#9A71FF]">{typeLabel}</span>
                      <span className="text-xs font-mono text-[#797681]">{entry.eventDate}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#f3f1f7] mb-3 group-hover:text-[#9A71FF] transition-colors">
                      {entry.title}
                    </h3>
                    {variant !== "minimal" && (
                      <p className="text-sm leading-relaxed text-[#797681]">{entry.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 w-full">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#9A71FF] block mb-1">
                      {typeLabel}
                    </span>
                    <span className="font-mono text-sm font-medium text-[#797681]">
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
